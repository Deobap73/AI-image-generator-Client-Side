// client/src/components/UserPhotos.jsx

import React, { useEffect, useState } from 'react';
import baseURL from '../config/api';
import Card from './Card';
import './UserPhotos.scss';

const UserPhotos = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/api/v1/post?user=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setUserPosts(result.data.reverse());
          } else {
            console.error('Data is undefined or null in the API response');
          }
        }
      } catch (err) {
        console.error('Error fetching user posts:', err);
      } finally {
        setLoading(false);
      }
    };
    // if (userId) {
    fetchUserPosts();
    // }
  }, [userId]);

  // Custom reusable component to render list of Card components
  const RenderCards = ({ data, title }) => {
    const getPositionInGrid = (index) => {
      return (index % 21) + 1; // Considering a grid of 21 columns
    };

    if (data?.length > 0) {
      return data.map((post, index) => (
        <Card
          key={post._id}
          {...post}
          positionInGrid={getPositionInGrid(index)}
        />
      ));
    }
    return <h2 className='mt-5'>{title}</h2>;
  };

  // Calculate the number of grids needed based on the number of photos
  const numGrids = Math.ceil((userPosts?.length || 0) / 21);

  // Create an array of grid indices to map over
  const gridIndices = Array.from({ length: numGrids }, (_, index) => index);

  return (
    <div className='userPhotosContainer'>
      <h2>My Generated Photos</h2>
      <div className='imagesContainer'>
        {gridIndices.map((gridIndex) => (
          <React.Fragment key={gridIndex}>
            {gridIndex > 0 && (
              <h2 className='showingResults'>
                Be curious and continue to see the amazing photos generated by
                our application
              </h2>
            )}
            <div className='grid-container'>
              <RenderCards
                data={userPosts?.slice(gridIndex * 21, (gridIndex + 1) * 21)}
                title={`No Posts Yet in Grid ${gridIndex + 1}`}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default UserPhotos;
