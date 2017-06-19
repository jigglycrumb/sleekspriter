var AppMenuWrapper = React.createClass({
  getInitialState: function() {
    return {
      submenu: null,
    };
  },
  render: function() {
    var style = {
      display: this.props.visible === true ? 'block' : 'none'
    };

    return (
      <ul id="AppMenuWrapper" style={style}>
        {menuConfig.map(function(submenu) {
          return (
            <AppMenuSubMenu
              key={submenu.label}
              label={submenu.label}
              visible={this.getSubMenuVisibility(submenu.label)}
              items={submenu.items}
              clickHandler={this.toggleSubMenu.bind(this, submenu.label)}
            />
          );
        }, this)}
      </ul>
    );
  },
  toggleSubMenu: function(menu) {
    if(menu === this.state.submenu) menu = null;
    this.setState({submenu: menu});
  },
  getSubMenuVisibility: function(menu) {
    return menu === this.state.submenu;
  },
});
