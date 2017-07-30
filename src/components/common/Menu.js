import React from "react";

const SEPERATOR = {label: "---"};

class Menu extends React.Component {
  render() {

    const MenuConfig = [
      {label: "File", items: [
        {label: "New…", action: () => { this.props.modalShow("ModalNewFile"); }},
        {label: "Open…", action: () => { this.props.modalShow("ModalLoadFile"); }}, // TODO: show modal only in browser
        {label: "Save"},
        {label: "Save as…"}, // Desktop only
        {label: "Import…", action: () => { this.props.modalShow("ModalImportFile"); }},
        SEPERATOR,
        {label: "Close"},
        SEPERATOR,
        {label: "About @@name"}, // Desktop only
        SEPERATOR,
        {label: "Quit @@name"}, // Desktop only, TODO: fix text replacement, it seems to work only once per file
      ]},
      {label: "Edit", items: [
        {label: "Cut"},
        {label: "Copy"},
        {label: "Paste"},
        {label: "Delete"},
        SEPERATOR,
        {label: "Rotate 180°"},
        {label: "Rotate 90° CW"},
        {label: "Rotate 90° CCW"},
        SEPERATOR,
        {label: "Flip Horizontal"},
        {label: "Flip Vertical"},
        SEPERATOR,
        {label: "Image size…"}
      ]},
      {label: "Select", items: [
        {label: "All", action: () => {
          this.props.selectionStart({ x: 1, y: 1 });
          this.props.selectionEnd({ x: this.props.size.width, y: this.props.size.height });
        }},
        {label: "Deselect", action: this.props.selectionClear },
      ]},
      {label: "Layer", items: [
        {label: "Merge with layer above"},
        {label: "Merge with layer below"},
      ]},
      {label: "Frame", items: [
        {label: "Rotate 180°"},
        {label: "Rotate 90° CW"},
        {label: "Rotate 90° CCW"},
        SEPERATOR,
        {label: "Flip Horizontal"},
        {label: "Flip Vertical"},
        SEPERATOR,
        {label: "Duplicate…"},
      ]},
      {label: "Window", items: [
        {label: "Paint"},
      ]},
    ];

    return (
      <nav className="menu">
        <ul>
          {MenuConfig.map((item, index) => {
            return (
              <li key={index}>
                <span>{item.label}</span>
                <div>
                  <ul>
                    {item.items.map((i, index2) => {
                      if(i === SEPERATOR) {
                        return <hr key={index2} />;
                      }

                      if(i.action) {
                        return <li key={index2} onClick={i.action}>{i.label}</li>;
                      }

                      return <li key={index2}>{i.label}</li>;
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default Menu;
