/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import PostForm from './forms/PostForm';
import SeshCard from './SeshCard';
import PostCard from './PostCard';
import { getSeshByCreator } from '../api/seshData';
import { getPosts } from '../api/postsData';
import { useAuth } from '../utils/context/authContext';

export default function ProfilePagination({ handle }) {
  const router = useRouter();
  const user = useAuth();
  const [mySeshes, setMySeshes] = useState([]);
  const [allPosts, setAllPosts] = useState();

  const getAllPosts = () => {
    getPosts().then(setAllPosts);
  };
  const getMySeshes = () => {
    getSeshByCreator(handle).then(setMySeshes);
  };

  useEffect(() => {
    getAllPosts();
    getMySeshes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tabs
      defaultActiveKey="home"
      transition={false}
      id="noanim-tab-example"
      className="mb-3"
    >
      <Tab eventKey="home" title="Posts">
        {user.handle === handle ? <PostForm onUpdate={getAllPosts} /> : ''}
        {allPosts?.map((post) => (
          <PostCard postObj={post} key={post.firebaseKey} onUpdate={getAllPosts} />
        ))}
      </Tab>
      <Tab eventKey="profile" title="Sessions">
        <Button
          variant="primary"
          type="submit"
          onClick={() => {
            router.push('/sesh/new');
          }}
        >Create Session
        </Button>
        <div className="mySeshes">
          <p>Created:</p>
          {mySeshes?.map((sesh) => (
            <SeshCard obj={sesh} key={sesh.firebaseKey} onUpdate={getMySeshes} />
          ))}
        </div>
      </Tab>
    </Tabs>
  );
}
