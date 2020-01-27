import { connect } from "react-redux";
import { ScreenStart } from "../screens";
import { modalShow } from "../../state/actions";

const mapDispatchToProps = { modalShow };

export default connect(null, mapDispatchToProps)(ScreenStart);
