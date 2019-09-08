import PropTypes from "prop-types";

const sizeShape = PropTypes.shape({
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
});

export default sizeShape;
