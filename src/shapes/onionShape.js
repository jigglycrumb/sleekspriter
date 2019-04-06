import PropTypes from "prop-types";

const onionShape = PropTypes.shape({
  active: PropTypes.bool.isRequired,
  frame: PropTypes.shape({
    fixed: PropTypes.number.isRequired,
    relative: PropTypes.number.isRequired,
  }).isRequired,
  mode: PropTypes.string.isRequired,
});

export default onionShape;
