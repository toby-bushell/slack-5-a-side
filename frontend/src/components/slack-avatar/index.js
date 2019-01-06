import React, { Fragment } from 'react';

// Material Ui
import { Avatar } from '@material-ui/core';

const SlackAvatar = ({ player }) => {
  return (
    <Fragment>
      {player.image ? <Avatar src={player.image} /> : <Avatar>R</Avatar>}
    </Fragment>
  );
};

export default SlackAvatar;
