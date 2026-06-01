// Video/Media export functionality
import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import ffmpeg from 'fluent-ffmpeg';

const router = Router();
const prisma = new PrismaClient();

// Export project to video
router.post('/:projectId/video', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { quality = '1080p', format = 'mp4' } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { elements: true, effects: true },
    });

    if (!project || project.userId !== req.userId) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create export job
    const exportJob = await prisma.export.create({
      data: {
        projectId,
        userId: req.userId!,
        status: 'PROCESSING',
        format,
        quality,
      },
    });

    // TODO: Queue FFmpeg processing job
    // This would typically be sent to a worker queue (Bull, RabbitMQ, etc.)

    res.json({
      message: 'Export started',
      exportId: exportJob.id,
      status: exportJob.status,
    });
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// Export as image
router.post('/:projectId/image', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { format = 'png' } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== req.userId) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const exportJob = await prisma.export.create({
      data: {
        projectId,
        userId: req.userId!,
        status: 'PROCESSING',
        format,
      },
    });

    res.json({
      message: 'Image export started',
      exportId: exportJob.id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// Get export status
router.get('/:exportId', authenticate, async (req, res) => {
  try {
    const exportJob = await prisma.export.findUnique({
      where: { id: req.params.exportId },
    });

    if (!exportJob || exportJob.userId !== req.userId) {
      return res.status(404).json({ error: 'Export not found' });
    }

    res.json(exportJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch export status' });
  }
});

// Get user exports history
router.get('/', authenticate, async (req, res) => {
  try {
    const exports = await prisma.export.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(exports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exports' });
  }
});

export default router;
