import useImage from "../hooks/useImage";

export interface ImageProps {
    fileName: string,
    alt: string,
    cssClasses?: string,
    width?: number
    height?: number
}

export default function Image({ fileName, alt, cssClasses, width, height }: ImageProps) {
    const { loading, error, image } = useImage(fileName);
    if (error) {
        return (
            <p className="text-xs">Image load error</p>
        )
    }
    return (
        <>
            {loading ? (
                <p>...</p>
            ) : (
                <img className={cssClasses} src={image || undefined} alt={alt} width={width || undefined} height={height || undefined} />
            )}
        </>
    )
}

