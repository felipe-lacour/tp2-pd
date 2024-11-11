import React, { useState, useRef } from 'react';
import './About.css';

const About = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const handlePlayPause = () => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    };

    return (
        <div className="about">
            <section
                className="banners"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/res/img/banner1.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '68vh',
                    color: 'white',
                    display: 'flex'
                }}>

                <h1>Listening is<br />everything</h1>
            </section>

            <section className="txtnimg">
                <article>
                    <div>
                        <h2>Unleash the Music Within</h2>
                        <p>
                            Unleash the power of music and let it awaken your soul.<br/>
                            Express yourself, discover new genres,<br/>and embrace the rhythm of life.
                        </p>
                    </div>

                    <img src="/res/img/about1.png" alt="Album Covers" className="img1" />
                </article>

                <article>
                    <figure className="disc">
                        <img src="/res/img/about2.jpg" alt="Slowtown - Artist" className="img2" />

                        <div className="botonPlay" onClick={handlePlayPause}>
                            <img
                                src={isPlaying ? '/res/img/pause-button.png' : '/res/img/play-button.png'}
                                alt={isPlaying ? 'Pause Button' : 'Play Button'}
                                className="botonn"
                            />
                        </div>

                        <audio ref={audioRef} id="reproductor" src="/res/audio/slowtown.mp3" type="audio/mp3" />
                    </figure>

                    <div>
                        <h2>Find the music you love</h2>
                        <p>
                            Listen to your favorite artists, check out new releases,<br/>or play the songs that take you back.
                        </p>
                    </div>
                </article>

                <article>
                    <div>
                        <h2>Discover Your Soundtrack</h2>
                        <p>
                            Explore millions of songs, podcasts, and curated playlists.<br/>Find your perfect soundtrack for<br/>every mood and moment.
                        </p>
                    </div>

                    <img src="/res/img/about3.png" alt="Album Covers" className="img3" />
                </article>
            </section>

            <section className="plans-zone">
                <div className="plans-title">
                    <h2>Pick your Premium</h2>
                    <p>Listen without limits on your phone, speaker, and other devices.</p>
                </div>

                <div className="plans">
                    {[
                        { title: 'Individual', price: '$12.99/month', accounts: '2 accounts', features: ['2 Premium accounts for a couple under one roof', 'Ad-free music listening, play offline, on-demand playback'] },
                        { title: 'Duo', price: '$9.99/month', accounts: '1 account', features: ['Ad-free music listening', 'Play anywhere - even offline', 'On-demand playback'] },
                        { title: 'Family', price: '$15.99/month', accounts: '6 accounts', features: ['6 Premium accounts for family members', 'Block explicit music', 'Ad-free music listening', 'Spotify Kids app'] },
                        { title: 'Student', price: '$4.99/month', accounts: '1 account', features: ['Hulu (ad-supported)', 'SHOWTIME', 'Ad-free music', 'Play anywhere - even offline'] }
                    ].map((plan, index) => (
                        <article key={index} className="card">
                            <div className="card-header">
                                <h3>{plan.title}</h3>
                                <p>{plan.price}</p>
                                <p>{plan.accounts}</p>
                            </div>
                            <div className="card-body">
                                {plan.features.map((feature, i) => (
                                    <p key={i}>● {feature}</p>
                              ))}
                            </div>
                            <a href="#" className="card-footer">Get started</a>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
