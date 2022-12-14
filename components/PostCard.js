import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import { useAuth } from '../utils/context/authContext';
import { deletePost } from '../api/postsData';

export default function PostCard({ postObj, onUpdate }) {
  const { user } = useAuth();
  const deleteThisPost = () => {
    if (window.confirm(`Delete ${postObj.firebaseKey}?`)) {
      deletePost(postObj.firebaseKey).then(() => onUpdate());
    }
  };
  return (
    <Card className="postCard">
      <Card.Body className="left">
        <Link href={`/profile/${postObj?.creator}`} passHref>
          <Card.Title>{postObj?.creator}</Card.Title>
        </Link>
        <Card.Subtitle><sup>{postObj?.time}</sup></Card.Subtitle>
        <Card.Title>{postObj?.post}</Card.Title>
      </Card.Body>
      <Card.Body className="right">
        {postObj?.creator === user.handle
          ? (
            <>
              <ButtonGroup>
                <Link href={`/post/edit/${postObj?.firebaseKey}`} passHref>
                  <Button className="smallBtn" variant="outline-primary"><AiFillEdit /> </Button>
                </Link>
                <Button className="smallBtn" variant="outline-danger" onClick={deleteThisPost}><BsFillTrashFill /></Button>
              </ButtonGroup>
            </>
          )
          : ''}

      </Card.Body>
    </Card>
  );
}

PostCard.propTypes = {
  postObj: PropTypes.shape({
    name: PropTypes.string,
    creator: PropTypes.string,
    image: PropTypes.string,
    link: PropTypes.string,
    post: PropTypes.string,
    time: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
