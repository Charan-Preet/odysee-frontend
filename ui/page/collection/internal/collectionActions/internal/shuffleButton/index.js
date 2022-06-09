import { connect } from 'react-redux';
import { doToggleShuffleList } from 'redux/actions/content';
import { selectListShuffle } from 'redux/selectors/content';
import ShuffleButton from './view';

const select = (state, props) => {
  const { collectionId } = props;

  const shuffleList = selectListShuffle(state);
  const shuffle = shuffleList && shuffleList.collectionId === collectionId && shuffleList.newUrls;
  const uri = shuffle && shuffle[0];

  return {
    uri,
  };
};

const perform = {
  doToggleShuffleList,
};

export default connect(select, perform)(ShuffleButton);
