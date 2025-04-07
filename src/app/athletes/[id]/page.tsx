import AthleteProfile from "@/components/athletes/AthleteProfile";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

export default function AthletePage({ params }: PageProps) {
  return (
    <main>
      <AthleteProfile athleteId={params.id} />
      <Link href={`/athletes/${params.id}`}>
        {/* Athlete card or list item */}
      </Link>
    </main>
  );
}
