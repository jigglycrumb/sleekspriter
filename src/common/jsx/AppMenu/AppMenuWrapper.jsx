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

    var fileMenuItems = [
      {title: 'New', action: Menu.actions.file.newFile},
      {title: 'Open', action: null},
      {title: 'Save', action: null},
      {title: 'Save as', action: null},
      {title: '---', action: null},
      {title: 'Close', action: null},
    ];

    var editMenuItems = [
      {title: 'Cut', action: null},
      {title: 'Copy', action: null},
      {title: 'Paste', action: null},
      {title: 'Delete', action: null},
      {title: '---', action: null},
      {title: 'Rotate 180°', action: null},
      {title: 'Rotate 90° CW', action: null},
      {title: 'Rotate 90° CCW', action: null},
      {title: '---', action: null},
      {title: 'Flip Horizontal', action: null},
      {title: 'Flip Vertical', action: null},
      {title: '---', action: null},
      {title: 'Image size …', action: null},
    ];

    var selectMenuItems = [
      {title: 'All', action: null},
      {title: 'Deselect', action: null},
    ];

    var layerMenuItems = [
      {title: 'Merge with layer above', action: null},
      {title: 'Merge with layer below', action: null},
    ];

    var frameMenuItems = [
      {title: 'Rotate 180°', action: null},
      {title: 'Rotate 90° CW', action: null},
      {title: 'Rotate 90° CCW', action: null},
      {title: '---', action: null},
      {title: 'Flip Horizontal', action: null},
      {title: 'Flip Vertical', action: null},
      {title: '---', action: null},
      {title: 'Duplicate …', action: null},
    ];

    var developerMenuItems = [
      {title: 'Open Developer Tools', action: null},
      {title: 'Reload App', action: null},
      {title: 'Show Debug Screen', action: null},
    ];

    return (
      <ul id="AppMenuWrapper" style={style}>
        <AppMenuSubMenu
          label="File"
          visible={this.getSubMenuVisibility('file')}
          items={fileMenuItems}
          clickHandler={this.toggleSubMenu.bind(this, 'file')}
        />
        <AppMenuSubMenu
          label="Edit"
          visible={this.getSubMenuVisibility('edit')}
          items={editMenuItems}
          clickHandler={this.toggleSubMenu.bind(this, 'edit')}
        />
        <AppMenuSubMenu
          label="Select"
          visible={this.getSubMenuVisibility('select')}
          items={selectMenuItems}
          clickHandler={this.toggleSubMenu.bind(this, 'select')}
        />
        <AppMenuSubMenu
          label="Layer"
          visible={this.getSubMenuVisibility('layer')}
          items={layerMenuItems}
          clickHandler={this.toggleSubMenu.bind(this, 'layer')}
        />
        <AppMenuSubMenu
          label="Frame"
          visible={this.getSubMenuVisibility('frame')}
          items={frameMenuItems}
          clickHandler={this.toggleSubMenu.bind(this, 'frame')}
        />
        <AppMenuSubMenu
          label="Developer"
          visible={this.getSubMenuVisibility('developer')}
          items={developerMenuItems}
          clickHandler={this.toggleSubMenu.bind(this, 'developer')}
        />
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
