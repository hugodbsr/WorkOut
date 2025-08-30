import {useEffect, useState} from "react";

const useFetch = <T>(fetchFunction:() => Promise<T>, autofetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result);
        }catch (err){
            setError(err instanceof Error ? err : new Error("An error as occured"));
        }finally {
            setLoading(false);
        }
    }
    const reset=()=>{
        setLoading(false);
        setError(null);
        setData(null);
    }

    useEffect(() => {
        if (autofetch) {
            fetchData();
        }
    }, []);
    return {data, error, loading, refetch: fetchData, reset};
}

export default useFetch;