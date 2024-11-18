import { Request, Response } from 'express';
import prisma from '../prisma/prismaClient';

// Create an Event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const { creatorName, eventName, location, dateTime, maxSpots, contact } = req.body;

  if (!creatorName || !eventName || !location || !dateTime || !maxSpots || !contact) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const newEvent = await prisma.event.create({
      data: {
        creatorName,
        eventName,
        location,
        dateTime: new Date(dateTime),
        maxSpots: parseInt(maxSpots, 10),
        contact,
        image: imageUrl,
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Get All Events
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await prisma.event.findMany({
        include: { participants: true }, // Include participants for debugging
      });  
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
};

// Get Single Event
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
      include: { participants: true },
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};
