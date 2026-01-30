import React from 'react';

export const Skeleton = ({ type, className = '' }) => {
    const classes = `skeleton ${type} ${className}`;

    if (type === 'page-home') {
        return (
            <div className="container" style={{ textAlign: 'left', padding: '2rem' }}>
                <div className="skeleton skeleton-title" style={{ width: '40%', margin: '0 0 2rem 0' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton skeleton-card" style={{ height: '140px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'page-login') {
        return (
            <div className="container" style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="skeleton skeleton-circle" style={{ width: '64px', height: '64px', margin: '0 auto 2rem' }}></div>
                <div className="skeleton skeleton-title" style={{ width: '60%', margin: '0 auto 1rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '40%', margin: '0 auto 2rem' }}></div>
                <div className="skeleton skeleton-card" style={{ height: '300px' }}></div>
            </div>
        );
    }

    if (type === 'document') {
        return (
            <div className="transcript-card" style={{ height: '100%', border: 'none', background: 'transparent', boxShadow: 'none' }}>
                <div className="skeleton skeleton-title" style={{ width: '50%', marginBottom: '2rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '85%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '90%', marginTop: '1.5rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
            </div>
        );
    }

    return <div className={classes}></div>;
};

export default Skeleton;
