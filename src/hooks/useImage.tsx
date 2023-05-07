import { useEffect, useState } from 'react'

const useImage = (fileName: string) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [image, setImage] = useState(null)

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const path = `../assets/img/${fileName}`;
                const response = await import(path /* @vite-ignore */);  // change relative path to suit your needs
                setImage(response.default);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchImage();
    }, [fileName])

    return {
        loading,
        error,
        image,
    }
}

export default useImage