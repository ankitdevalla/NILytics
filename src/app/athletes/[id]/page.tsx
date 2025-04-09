import AthleteProfile from "@/components/athletes/AthleteProfile";

export default async function AthletePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main>
      <AthleteProfile athleteId={params.id} />
    </main>
  );
}
