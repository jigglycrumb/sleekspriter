import PropTypes from "prop-types";

const layerShape = PropTypes.shape({
  frame: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  z: PropTypes.number.isRequired,
});

export default layerShape;
