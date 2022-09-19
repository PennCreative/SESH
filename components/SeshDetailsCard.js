import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';
import { deleteSesh } from '../api/seshData';
import { viewAttendanceDetails } from '../api/mergedData';
import { createAttendance, removeAttendance } from '../api/attendanceData';

export default function SeshDetailsCard({ seshObj }) {
  const router = useRouter();
  const { user } = useAuth();
  const [attendanceDetails, setAttendanceDetails] = useState({});
  const [attending, setAttending] = useState([]);
  const [mySesh, setMySesh] = useState({});

  const checkIfAttending = () => {
    viewAttendanceDetails(seshObj?.firebaseKey).then((response) => {
      setAttendanceDetails(response);
      const match = attendanceDetails.attendees?.filter((obj) => obj.attendeeId === user.handle);
      if (match?.length > 0) {
        setAttending(true);
        setMySesh(...match);
      } else {
        setAttending(false);
      }
    });
  };
  useEffect(() => {
    checkIfAttending();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceDetails, attending, mySesh]);

  const deleteThisSesh = () => {
    if (window.confirm(`Delete ${seshObj.firebaseKey}?`)) {
      deleteSesh(seshObj.firebaseKey).then(() => router.push('/sesh'));
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>{seshObj?.title}</Card.Title>
        <sup><b>{seshObj?.city}, {seshObj?.state}</b></sup>
        <br />
        <Link href={`/profile/${seshObj?.creator}`} passHref>
          <sup>@{seshObj?.creator}</sup>
        </Link>
        <sub>{seshObj?.time}</sub>
        <Card.Text>
          {seshObj?.description}
          <br />
        </Card.Text>
        {seshObj?.creator === user.handle ? (
          <>
            <Link href={`/sesh/edit/${seshObj?.firebaseKey}`} passHref>
              <Button variant="info">EDIT</Button>
            </Link>
            <Button variant="link" onClick={deleteThisSesh}>Delete Sesh</Button>
          </>
        ) : '' }
        {attending
          ? (
            <>
              <Button
                type="button"
                className="btn editBtn btn-dark"
                id={mySesh.firebaseKey}
                onClick={() => {
                  removeAttendance(mySesh.firebaseKey).then(() => checkIfAttending());
                }}
              >Nevermind
              </Button>
            </>
          )
          : (
            <Button
              type="button"
              onClick={() => {
                const payload = {
                  attendeeId: user.handle,
                  eventId: seshObj.firebaseKey,
                };
                createAttendance(payload).then(() => checkIfAttending());
              }}
              className="btn editBtn btn-info"
            >Attend
            </Button>
          )}
      </Card.Body>
    </Card>
  );
}

SeshDetailsCard.propTypes = {
  seshObj: PropTypes.shape({
    title: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    creator: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    link: PropTypes.string,
    description: PropTypes.string,
    time: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
};
