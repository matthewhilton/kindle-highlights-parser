import { Button } from "react-aria-components";

export default function ResetButton({ onPress }: { onPress: () => void }) {
    return (
        <Button
            className="bg-red-500 rounded-lg p-4"
            onPress={() => onPress()}
            > Reset
        </Button>
    )
}