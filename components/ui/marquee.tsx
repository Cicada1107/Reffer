import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure className="w-64 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-md transition hover:scale-105 hover:bg-white/10">
      <div className="flex items-center gap-3">
        <img
          className="rounded-full"
          width="36"
          height="36"
          alt={name}
          src={img}
        />
        <div>
          <figcaption className="text-sm font-medium text-white">{name}</figcaption>
          <p className="text-xs text-gray-400">{username}</p>
        </div>
      </div>
      <blockquote className="mt-3 text-sm text-gray-300">{body}</blockquote>
    </figure>
  );
};


export function MarqueeDemo() {
  return (
    <div className="relative w-full py-40 overflow-hidden">
      <h2 className="text-3xl font-bold text-white text-center mb-10">
        Loved by job seekers
      </h2>


      {/* Marquee Rows */}
      <div className="relative z-10">
        {/* Top row: right to left */}
        <Marquee pauseOnHover className="[--duration:40s]">
          {firstRow.map((review) => (
            <div key={review.username} className="mx-0">
              <ReviewCard {...review} />
            </div>
          ))}
        </Marquee>

        {/* Bottom row: left to right */}
        <Marquee reverse pauseOnHover className="[--duration:40s] mt-2">
          {secondRow.map((review) => (
            <div key={review.username} className="mx-0">
              <ReviewCard {...review} />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Subtle fade edges */}
      {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-black to-transparent z-20"></div> */}
      {/* <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black to-transparent z-20"></div> */}
    </div>
  );
}


