
export default async function ProblemPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id: problemId } = await params;
    return <div>Problem page: id {problemId}</div>
}