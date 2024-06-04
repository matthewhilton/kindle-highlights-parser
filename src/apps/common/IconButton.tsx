import { Button } from "react-aria-components";

interface Props {
    pressed: boolean,
    onPress: () => void,
    iconSrc: string,
    text: string
}

/**
 * Square looking button that also has an icon.
 */
export default function IconButton({ pressed, onPress, iconSrc, text }: Props) {
    return (
        <Button 
        className={"rounded-md p-4 flex flex-col items-center w-max max-w-24 justify-center focus:outline-none " + (!pressed ? "bg-neutral-200" : "bg-orange-300")}
        aria-pressed={pressed}
        onPress={onPress}>
            <img src={iconSrc} />
            {text}
        </Button>
    )
}