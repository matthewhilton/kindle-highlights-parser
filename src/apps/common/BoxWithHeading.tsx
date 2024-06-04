export default function BoxWithHeading({ heading, children }: { heading: string, children?: React.ReactNode }) {
    return(
        <div className="rounded-lg bg-neutral-100 p-4">
                <h1 className="font-semibold mb-3 text-lg"> {heading} </h1>
                {children}
        </div>
    )
}