// pages/index.tsx

import TrendingSidebarCard from '../components/TrendingSidebarCard';
import { Configuration, NeynarAPIClient } from '@neynar/nodejs-sdk';

// --- MOCK DATA for fallback while API is paywalled or offline ---
const MOCK_CASTS = [
  {
    text: 'Check out the latest cool things on Farcaster!',
    author: { display_name: 'Yash', username: 'yash_user' },
    reactions: { likes_count: 12, recasts_count: 5 },
    channel: { name: 'general' },
  },
  {
    text: 'What are your favorite web3 apps? #crypto',
    author: { display_name: 'Jane', username: 'janeweb3' },
    reactions: { likes_count: 8, recasts_count: 2 },
    channel: { name: 'discussion' },
  },
  {
    text: 'Farcaster dev update #devlog',
    author: { display_name: null, username: 'devguy' },
    reactions: { likes_count: 19, recasts_count: 10 },
    channel: { name: 'devs' },
  },
  // Add more mocks if you want!
];

// --- Types/Interfaces ---
interface TrendItem {
  title: string;
  subtitle: string;
  count: string;
}

interface TrendSection {
  label: string;
  items: TrendItem[];
}

interface CastAuthor {
  display_name?: string | null;
  username: string;
}

interface CastReactions {
  likes_count: number;
  recasts_count: number;
}

interface CastChannel {
  name: string;
}

interface Cast {
  text: string;
  author: CastAuthor;
  reactions: CastReactions;
  channel?: CastChannel;
}

// --- Utility: extract hashtags ---
function extractHashtags(text: string): string[] {
  return (
    text.match(/#[a-zA-Z0-9_]+/g) || []
  ).map((tag) => tag.toLowerCase());
}

// --- Main Page Component ---
export default function Home({ trends }: { trends: TrendSection[] }) {
  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-950 p-8">
      <TrendingSidebarCard trends={trends} />
    </div>
  );
}

// --- Server-side Data Fetch (API or Mock) ---
export async function getServerSideProps() {
  let casts: Cast[] = [];

  try {
    const client = new NeynarAPIClient(
      new Configuration({ apiKey: process.env.NEYNAR_API_KEY! })
    );
    const res = await client.fetchFeed({
      feedType: 'filter',
      filterType: 'global_trending',
      limit: 25,
    });
    casts = (res.casts as Cast[]) || [];
  } catch (error) {
    console.error('API fetch error, using mock data:', error);
    casts = MOCK_CASTS as Cast[];
  }

  // Trending Casts (top 5)
  const trendingCasts = casts
    .slice(0, 5)
    .map((cast) => ({
      title: cast.text,
      subtitle: `by ${cast.author.display_name ?? cast.author.username}`,
      count: String(
        (cast.reactions?.likes_count || 0) +
        (cast.reactions?.recasts_count || 0)
      ),
    }));

  // Count tags, channels, and users
  const tagCounts: Record<string, number> = {};
  const channelCounts: Record<string, number> = {};
  const userCounts: Record<string, number> = {};

  casts.forEach((cast) => {
    // Tags
    extractHashtags(cast.text).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    // Channel
    if (cast.channel?.name) {
      const name = cast.channel.name;
      channelCounts[name] = (channelCounts[name] || 0) + 1;
    }

    // User
    const authorName = cast.author.display_name ?? cast.author.username;
    userCounts[authorName] = (userCounts[authorName] || 0) + 1;
  });

  const trendingTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({
      title: `#${tag}`,
      subtitle: '',
      count: String(count),
    }));

  const trendingChannels = Object.entries(channelCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([channel, count]) => ({
      title: channel,
      subtitle: '',
      count: String(count),
    }));

  const trendingUsers = Object.entries(userCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => {
      const castForUser = casts.find(
        (c) =>
          (c.author.display_name ?? c.author.username) === name
      );
      return {
        title: name,
        subtitle: '@' + (castForUser?.author.username ?? ''),
        count: String(count),
      };
    });

  const trendingTopics = trendingTags.map((item) => ({
    title: item.title,
    subtitle: '',
    count: item.count,
  }));

  const trends: TrendSection[] = [
    { label: 'Trending Casts', items: trendingCasts },
    { label: 'Trending Tags', items: trendingTags },
    { label: 'Trending Channels', items: trendingChannels },
    { label: 'Trending Users', items: trendingUsers },
    { label: 'Trending Topics', items: trendingTopics },
  ];

  return { props: { trends } };
}
