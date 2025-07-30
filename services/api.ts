export const API_CONFIG = {
    BASE_URL: 'https://wger.de/api/v2',
    headers: {
        accept: 'application/json',
    },
};

export const fetchMuscleList = async () => {
    const endpoint = `${API_CONFIG.BASE_URL}/exercisecategory/`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    return data.results;
};

export const fetchMuscle = async ({query}: {query:string}) => {
    const endpoint = `${API_CONFIG.BASE_URL}/exercisecategory/${query}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();

    return {
        name: data?.name,
    };
}

export const fetchExerciceList = async ({query}: {query:string}) => {
    const endpoint = `${API_CONFIG.BASE_URL}/exerciseinfo/?category=${query}&language=2&limit=200`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    return data.results
        .filter((exercise: any) => exercise.images.length > 0)
        .map((exercise: any) => {
            const translation = exercise.translations.find((t: any) => t.language === 2);
            return {
                id: exercise.id,
                name: translation?.name,
                description: translation?.description,
                image: exercise.images[0]?.image,
            };
        })
        .filter(Boolean);
};

export const fetchExercice = async ({query}: {query:string}) => {
    const endpoint = `${API_CONFIG.BASE_URL}/exerciseinfo/${query}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    const translation = data.translations?.find((t: any) => t.language === 2);

    return {
        name: translation?.name,
        description: translation?.description,
    };
}