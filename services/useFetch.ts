import { useEffect, useState, useCallback, useRef } from "react";

const useFetch = <T>(fetchFunction:() => Promise<T>, autofetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchRef = useRef(fetchFunction);
    
    useEffect(() => {
        fetchRef.current = fetchFunction;
    }, [fetchFunction]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchRef.current();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("An error as occured"));
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    useEffect(() => {
        if (autofetch) {
            fetchData();
        }
    }, []);
    return {data, error, loading, refetch: fetchData, reset};
}

export default useFetch;