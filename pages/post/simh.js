import React from 'react';
import FormData from 'form-data';
import axios from 'axios';
import qs from 'qs';
import Image from 'next/image';


const MonthSection = (props) => {
    const { name, items } = props;

    return (<div>
        <h2>{name}</h2>
        <hr/>
        {items.map((item, index) => {
            const { name, album: { images } } = item;

            return <div key={index}>
                <Image src={images[0].url} alt='test' width={300} height={300}/>
                <h3>{name}</h3>
            </div>
        })}

    </div>)
}

const StuckInMyHead = (props) => {
    const { playlists } = props;

    return (<>
        <h1>Stuck in My Head</h1>
        { playlists.map((playlist, index) => <MonthSection key={index} {...playlist} />)}

    </>)

}

export async function getStaticProps() {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_USER_ID } = process.env;
    const form = new FormData();
    form.append('grant_type', `client_credentials`);

    // get access token
    const { data } = await axios({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        data: qs.stringify({
            grant_type: 'client_credentials'
        }),
        headers: {
            Authorization: `Basic ${new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')}`,
            'content-type': 'application/x-www-form-urlencoded'
        }
    });

    // get the playlists
    const { access_token } = data;
    const { items } = await fetch(`https://api.spotify.com/v1/users/${SPOTIFY_USER_ID}/playlists`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
            'content-type': 'application/json'
        }
    })
    .then(r => r.json())
    .catch(() => ({ items: []}));

    const playlists = await Promise.all(items.filter(({name}) => name.startsWith('SIMH')).map(async ({tracks, name}) => {
        const { href } = tracks;

        const { items } = await fetch(href, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'content-type': 'application/json'
            }
        })
        .then(r => r.json());

        return { items: items.map(({track}) => track), name }
    }));
    
    return { 
        props: {
            playlists
        }
    }
}

export default StuckInMyHead;