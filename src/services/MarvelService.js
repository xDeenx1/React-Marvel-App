import { useHTTP } from "../hooks/htttp.hook";

const useMarvelService = () => {
    const {loading, error, request, clearError} = useHTTP();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=4564f847344360f1ae3e9c553d76d20a';
    const _baseOffset = 210;



    const getAllCharacters = async(offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformChar);
    }

    const getCharacter = async(id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformChar(res.data.results[0]);
    }

    const getAllComics = async(offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async(id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const searchCharacterByName = async(charName) => {
        const res = await request(`${_apiBase}characters?name=${charName}&${_apiKey}`);

        return res.data.results.map(_transformChar);
    };

    const _transformChar = (char) => {
        return {
                    id: char.id,
                    name: char.name,
                    descr: char.description ? char.description.slice(0, 210) + '...' : 'There is no description for this character',
                    thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
                    homePage: char.urls[0].url,
                    wiki: char.urls[1].url,
                    comics: char.comics.items
                }
            }

    const _transformComics = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            description: comic.description || 'There is no description for this comic.',
            pageCount: comic.pageCount ? `${comic.pageCount} pages` : 'There is no information about the number of pages.',
            prices: comic.prices[0].price === 0 ? 'Not Available' : `${comic.prices[0].price} $`,
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            languages: comic.textObjects.length > 1 ? comic.textObjects[0].language : 'en-us'
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic, searchCharacterByName}
}

export default useMarvelService;