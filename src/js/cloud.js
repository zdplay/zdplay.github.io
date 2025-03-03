import axios from 'axios';

const instance = axios.create({
    baseURL: "https://save.agenslot.eu.org",
    timeout: 30000
});

instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export function loadSaveFile(savefile, userId, tokenId) {
    const gameId = window.location.hostname;

    const params = {
        user_id: userId,
        token_id: tokenId,
        game_id: gameId,
        savefile: savefile
    };

    return instance({
        url: '/load.php',
        method: 'get',
        params: params,
    });
}

export async function getLatestData(userId, tokenId) {
    const gameId = window.location.hostname;

    const params = {
        user_id: userId,
        token_id: tokenId,
        game_id: gameId,
        count: 1
    };

    try {
        const response = await instance({
            url: '/load.php',
            method: 'get',
            params: params,
        });

        if (response.save_data) {
            return response.save_data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("获取最新的存档失败:", error);
        throw error;
    }
}

export async function getLatestDataList(userId, tokenId, count = 5) {
    const gameId = window.location.hostname;

    const params = {
        user_id: userId,
        token_id: tokenId,
        game_id: gameId,
        count: count
    };

    try {
        const response = await instance({
            url: '/load.php',
            method: 'get',
            params: params,
        });

        if (response.save_files && response.save_files.length > 0) {
            return response.save_files;
        } else {
            return [];
        }
    } catch (error) {
        console.error("获取最新的存档列表失败:", error);
        throw error;
    }
}


export function saveData(save_data, userId, tokenId) {
    const gameId = window.location.hostname;

    const data = {
        user_id: userId,
        token_id: tokenId,
        game_id: gameId,
        save_data: save_data
    };
    console.log(data)
    return instance({
        url: '/save.php',
        method: 'post',
        data: data
    });
}

export default instance;
