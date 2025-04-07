import AthleteProfile from "@/components/athletes/AthleteProfile";

interface PageProps {
  params: {
    id: string;
  };
}

export default function AthletePage({ params }: PageProps) {
  return (
    <main>
      <AthleteProfile athleteId={params.id} />
    </main>
  );
}
