import React from 'react';
import {Progress} from 'semantic-ui-react';

const ProgressBar = ({percentage, uploading}) => {
    return uploading ? (
        <Progress
            percent={percentage}
            indicating
            progress
            className="progress__bar"
            inverted
            />
    ) : '';
}

export default ProgressBar;