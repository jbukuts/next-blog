import React, { useEffect, useRef, useState } from 'react';
import styles from './PostCard.module.scss';
import helpers from '../../helpers';
import Link from 'next/link';

const DATE_OPTIONS = { year: 'numeric', month: 'short', day: 'numeric' };

const PostCard = (props) => {
    const { slug, excerpt, tags, time_to_read, date, style } = props;
    const cardRef = useRef(null);
    const [angleX, setAngleX] = useState(0);
    const [angleY, setAngleY] = useState(0);

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
        }

        const throttleHelper = helpers.throttle(mouseOver, 25);
        element.addEventListener('mousemove', throttleHelper);
        element.addEventListener('mouseleave', mouseLeave);

        return () => {
            element.removeEventListener('mousemove', throttleHelper);
            element.removeEventListener('mouseleave', mouseLeave);
        }
    }, []);

    return (<Link href={`/post/${slug}`} tabIndex={0}>
        <a style={style}>
            <div className={styles['post-card__wrapper']}>
                <div 
                    style={{ transform: `rotateY(${angleX}deg) rotateX(${angleY}deg)` }}
                    ref={cardRef}
                    className={styles['post-card__container']}
                >
                    <article dangerouslySetInnerHTML={{__html: excerpt}}/>
                    <div className={styles['post-card__tags']}>
                        {tags.map((tag, i) => {
                            const backgroundColor = helpers.hashAColor(tag);
                            const color = helpers.getAccentColor(backgroundColor);
                            return <small style={{backgroundColor, color}} key={i}>{tag}</small>
                        })}
                        <div/>
                        <small>{new Date(date).toLocaleDateString(undefined, DATE_OPTIONS)}</small>
                        <small>{time_to_read} min</small>
                    </div>
                </div>
            </div>
        </a>
    </Link>);
}

export default PostCard;