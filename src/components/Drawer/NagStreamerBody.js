/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button, MenuItem, Divider, Classes,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { useBits, setSelectedProduct } from '@/redux/productsSlice';
import { TRANSLATION_COST } from '@/utils/Constants';
import { productMenuItemRenderer } from './ProductMenuItem';

function NagStreamerBody({
  translationInfo: { activationInfo },
  productsCatalog,
  onUseBits,
  onProductSelect,
}) {
  let buttonCopy = productsCatalog.products[0].displayName;
  if (productsCatalog.selectedProduct) {
    buttonCopy = productsCatalog.selectedProduct.displayName;
  }

  let extraBitsBalanceInfo = (
    <React.Fragment>
      <p>But there are enough bits purchased to turn on translations for <b>{Math.floor(activationInfo.balance / TRANSLATION_COST)} stream day(s)</b>.</p>
      <p><i>A stream day is a 24 hours of active translations from the moment the broadcaster turns on Stream Closed Captioner</i></p>
    </React.Fragment>
  );

  if (activationInfo.activated) {
    extraBitsBalanceInfo = null;
  }

  const languageKeys = Object.keys(activationInfo.languages);

  return (
    <div data-testid="nag-streamer" className={Classes.DIALOG_BODY}>
      <p>The broadcaster currently does not have <b>Stream Closed Captioner</b> turned on.</p>
      { extraBitsBalanceInfo }
      <p>Let the broadcaster know you would like them to turn on <b>Stream Closed Captioner</b> so you can see <b>Translated Closed Captions</b> by visiting <a href="https://stream-cc.gooseman.codes">https://stream-cc.gooseman.codes</a></p>
      <p>Current languages supported:</p>
      <ul>
        { languageKeys.map((langKey) => <li key={langKey}>{activationInfo.languages[langKey]}</li>)}
      </ul>
      <p>You can add more translation stream days by selecting an option below and click Submit.</p>
      <Select
        items={productsCatalog.products}
        filterable={false}
        itemRenderer={productMenuItemRenderer}
        noResults={<MenuItem disabled={true} text="Not found." />}
        onItemSelect={(product) => onProductSelect(product)}>
        <Button text={buttonCopy} rightIcon="double-caret-vertical" />
      </Select>
      <Divider />
      <Button intent="success" icon="confirm" onClick={() => onUseBits(productsCatalog.selectedProduct.sku)}>
          Submit
      </Button>
    </div>
  );
}

NagStreamerBody.propTypes = {
  translationInfo: PropTypes.object.isRequired,
  productsCatalog: PropTypes.shape({
    products: PropTypes.array,
    selectedProduct: PropTypes.object,
  }),
  onUseBits: PropTypes.func,
  onProductSelect: PropTypes.func,
};

const mapStateToProps = (state) => ({
  translationInfo: state.translationInfo,
  productsCatalog: state.productsCatalog,
});

const mapDispatchToProps = (dispatch) => ({
  // eslint-disable-next-line react-hooks/rules-of-hooks
  onUseBits: (sku) => dispatch(useBits(sku)),
  onProductSelect: (product) => dispatch(setSelectedProduct(product)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NagStreamerBody);
