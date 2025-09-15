"use server";
import prisma from "@/lib/prisma";
export async function getAllEvents() {
  const events = await prisma.events.findMany();
  return events;
}
export async function createEvent(data) {
  await prisma.events.create({
    data: {
      title: data.title,
      description: data.description,
      startsAt: data.startsAt,
      location: data.location,
      endsAt: data.endsAt,
    },
  });
}
export async function deleteEvent(id) {
  await prisma.events.delete({
    where: { id },
  });
}
export async function updateEvent(id, data) {
  await prisma.events.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      startsAt: data.startsAt,
      location: data.location,
      endsAt: data.endsAt,
    },
  });
}
export async function getEventById(id) {
  const event = await prisma.events.findUnique({
    where: { id },
  });
  return event;
}
export async function getEventsByDate(date) {
  const events = await prisma.events.findMany({
    where: { date },
  });
  return events;
}
export async function getUpcomingEvents() {
  const events = await prisma.events.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    orderBy: { date: "asc" },
    take: 5,
  });
  return events;
}
