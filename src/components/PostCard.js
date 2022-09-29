import React, { useEffect, useRef, useState } from 'react';
import styles from './PostCard.module.scss';
import helpers from '../helpers';
import { withRouter } from 'next/router';

const DATE_OPTIONS = { year: 'numeric', month: 'short', day: 'numeric' };

const PostCard = (props) => {
    const { slug, excerpt, tags, time_to_read, router, date } = props;
    const cardRef = useRef(null);
    const [angleX, setAngleX] = useState(0);
    const [angleY, setAngleY] = useState(0);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);

    const goToSlug = () => router.push(`/post/${slug}`);

    useEffect(() => {
        const element = cardRef.current;
        if (!element) return;

        const mouseLeave = () => {
            setAngleX(0);
            setAngleY(0);
        }

        const mouseOver = (event) => {
            const target = event.target;
            const {left, top, width, height} = target.getBoundingClientRect();
            const x = event.clientX - left;
            const y = event.clientY - top;            
            setAngleX(Math.ceil(( (width / 2) - x ) * -.01));
            setAngleY( Math.ceil(( (height / 2) - y ) * .1));
            setPosX(x);
            setPosY(y);
        }

        const throttleHelper = helpers.throttle(mouseOver, 25);
        element.addEventListener('mousemove', throttleHelper);
        element.addEventListener('mouseleave', mouseLeave);

        return () => {
            element.removeEventListener('mousemove', throttleHelper);
            element.removeEventListener('mouseleave', mouseLeave);
        }
    }, []);

    return (<div className={styles['post-card__wrapper']}>
        <section 
            style={{ transform: `rotateY(${angleX}deg) rotateX(${angleY}deg)` }}
            ref={cardRef}
            tabIndex={0}
            className={styles['post-card__container']} 
            onClick={goToSlug}
            onKeyDown={({code}) =>  code === 'Enter' && goToSlug()}
        >
            <article dangerouslySetInnerHTML={{__html: excerpt}}/>
            <div className={styles['post-card__shine']} style={{ transform: `translate(${posX-25}px, ${posY-25}px)`}}/>
            <div className={styles['post-card__tags']}>
                <small>{new Date(date).toLocaleDateString(undefined, DATE_OPTIONS)}</small>
                <small>{time_to_read} min</small>
                {tags.map((tag, i) => {
                    const backgroundColor = helpers.hashAColor(tag);
                    const color = helpers.getAccentColor(backgroundColor);
                    return <small style={{backgroundColor, color, border: `1px solid ${backgroundColor}`}} key={i}>{tag}</small>
                })}
            </div>
            
        </section>
    </div>);
}

export default withRouter(PostCard);