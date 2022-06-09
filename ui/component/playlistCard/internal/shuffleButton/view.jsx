// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  url: string,
  id: string,
  // -- redux --
  shuffle: boolean,
  doToggleShuffleList: (currentUri: ?string, collectionId: string, shuffle: boolean) => void,
};

const ShuffleButton = (props: Props) => {
  const { url, id, shuffle, doToggleShuffleList } = props;

  return (
    <Button
      button="alt"
      className="button--alt-no-style button-toggle"
      title={__('Shuffle')}
      icon={ICONS.SHUFFLE}
      iconSize={18}
      iconColor={shuffle ? 'blue' : undefined}
      onClick={() => doToggleShuffleList(url, id, !shuffle)}
    />
  );
};

export default ShuffleButton;
