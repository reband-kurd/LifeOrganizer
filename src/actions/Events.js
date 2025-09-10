"use server";
import prisma from "@/lib/prisma";
export async function getAllEvents() {
  const events = await prisma.event.findMany();
  return events;
}
export async function createEvent(data) {
  await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      startsAt: data.startsAt,
      location: data.location,
      endsAt: data.endsAt,
    },
  });
}
export async function deleteEvent(id) {
  await prisma.event.delete({
    where: { id },
  });
}
export async function updateEvent(id, data) {
  await prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      startsAt: data.startsAt,
      location: data.location,
      endsAt: data.endsAt,
    },
  });
}
export async function getEventById(id) {
  const event = await prisma.event.findUnique({
    where: { id },
  });
  return event;
}
export async function getEventsByDate(date) {
  const events = await prisma.event.findMany({
    where: { date },
  });
  return events;
}
export async function getUpcomingEvents() {
  const events = await prisma.event.findMany({
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
