'use client';

import Link from "next/link";
import Image from "next/image";

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST
);

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}


const EventCard = ({ title, image, slug, location, date, time }: Props) => {
  return (
    <Link
      href={`/events/${slug}`}
      id="event-card"
      onClick={() => {
        if (isPostHogConfigured) {
          window.posthog?.capture("event_details_opened", { event_slug: slug });
        }
      }}
    >
        <Image src={image} alt={title} width={410} height={300} className="poster" />

        <div className="flex flex-row gap-2">
            <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
            <p>{location}</p>
        </div>

        <p className="title">{title}</p>

        <div className="datetime">
            <div>
                <Image src="icons/calendar.svg" alt="date" width={14} height={14} />
                <p>{date}</p>
            </div>
            <div>
                <Image src="icons/clock.svg" alt="time" width={14} height={14} />
                <p>{time}</p>
            </div>
        </div>

    </Link>
  )
}

export default EventCard
