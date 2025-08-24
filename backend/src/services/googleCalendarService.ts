import { google } from "googleapis";
import { getAuthorizedOAuthClient } from "./googleTokenManager";
import Task, {TaskDocument} from "../models/Task"; 


export async function createGoogleCalendarEvent(task : TaskDocument, userId: string) {
  const auth = await getAuthorizedOAuthClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: new Date(task.createdAt).toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: new Date(task.createdAt.getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: "America/New_York",
      },
    },
  });

  return event.data.id;
}

export async function updateGoogleCalendarEvent(task: TaskDocument, userId: string) {
  const auth = await getAuthorizedOAuthClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.update({
    calendarId: "primary",
    eventId: task.googleEventId,
    requestBody: {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: new Date(task.createdAt).toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: new Date(task.createdAt.getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: "America/New_York",
      },
    },
  });
}

export async function deleteGoogleCalendarEvent(eventId: any, userId: string) {
  const auth = await getAuthorizedOAuthClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.delete({
    calendarId: "primary",
    eventId,
  });
}

export async function syncAllTasks(userId: string) {
  const auth = await getAuthorizedOAuthClient(userId);
      
      const calendar = google.calendar({ version: "v3", auth });
  
      const tasks = await Task.find({ userId });
      
      for (const task of tasks) {
        const event = {
          summary: task.title,
          description: task.description,
          start: {
            dateTime: new Date(task.timeBlock.start).toISOString(),
            timeZone: "America/New_York",
          },
          end: {
            dateTime: new Date(task.timeBlock.end).toISOString(),
            timeZone: "America/New_York",
          },
        };
  
        if (task.googleEventId && task.deleted){
          try {
            await calendar.events.delete({
              calendarId: "primary",
              eventId: task.googleEventId,
            });
            console.log(`Deleted event: ${task.googleEventId}`);
          } catch (error: any) {
            if (error.code === 404) {
              console.warn(`Event ${task.googleEventId} not found in Google Calendar.`);
            } else {
              console.error("Failed to delete calendar event:", error);
            }
          }
          await Task.findByIdAndDelete(task._id);
        }
        else if (!task.googleEventId) {
          const res = await calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
          });
  
          task.googleEventId = res.data.id;
          task.syncedWithGoogle = true;
          await task.save();
        } else {
          await calendar.events.update({
            calendarId: "primary",
            eventId: task.googleEventId,
            requestBody: event,
          });
        }
      }
}
