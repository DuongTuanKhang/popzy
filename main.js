const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal(options = {}) {
  const {
    templateId,
    destroyOnClose = true,
    closeMethods = ["close", "overlay", "escape"],
    cssClass = [],
    onOpen,
    onClose,
  } = options;
  const template = $(`#${templateId}`);

  if (!template) {
    console.error(`#${templateId} does not exist!`);
    return;
  }

  this._allowBackdropClose = closeMethods.includes("overlay");
  this._allowButtonClose = closeMethods.includes("close");
  this._allowEscapeClose = closeMethods.includes("escape");
  function getScrollbarWidth() {
    if (getScrollbarWidth.value) {
      console.log("Trả về kích thước đã lưu ( không phải tính lại ) ");
      return getScrollbarWidth.value;
    }
    const div = document.createElement("div");
    Object.assign(div.style, {
      overflow: "scroll",
      position: "absolute",
      top: "-999px",
    });

    document.body.appendChild(div);

    const scrollbarWidth = div.offsetWidth - div.clientWidth;

    document.body.removeChild(div);
    getScrollbarWidth.value = scrollbarWidth;

    console.log("Tính toán kích thước thanh cuộn: ", scrollbarWidth);
    return scrollbarWidth;
  }

  this._build = () => {
    const content = template.content.cloneNode(true);

    // Create modal elements
    this._backdrop = document.createElement("div");
    this._backdrop.className = "modal-backdrop";

    const container = document.createElement("div");
    container.className = "modal-container";

    cssClass.forEach((className) => {
      if (typeof className === "string") {
        container.classList.add(className);
      }
    });

    if (this._allowButtonClose) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "modal-close";
      closeBtn.innerHTML = "&times;";

      container.append(closeBtn);
      closeBtn.onclick = () => this.close();
    }

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Append content and elements
    modalContent.append(content);
    container.append(modalContent);
    this._backdrop.append(container);
    document.body.append(this._backdrop);
  };

  this.open = () => {
    if (!this._backdrop) {
      this._build();
    }

    setTimeout(() => {
      this._backdrop.classList.add("show");
    }, 0);

    // Attach event listeners

    if (this._allowBackdropClose) {
      this._backdrop.onclick = (e) => {
        if (e.target === this._backdrop) {
          this.close();
        }
      };
    }
    if (this._allowEscapeClose) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.close();
        }
      });
    }
    this._backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "transform") return;
      if (typeof onOpen === "function") {
        onOpen();
      }
    };
    // Disable scrolling
    document.body.classList.add("no-scroll");
    document.body.style.paddingRight = getScrollbarWidth() + "px";

    return this._backdrop;
  };

  this.close = (destroy = destroyOnClose) => {
    this._backdrop.classList.remove("show");
    this._backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "transform") return;
      if (this._backdrop && destroy) {
        this._backdrop.remove();
        this._backdrop = null;
      }

      // Enable scrolling
      document.body.classList.remove("no-scroll");
      document.body.style.paddingRight = "";
    };

    if (typeof onClose === "function") {
      onClose();
    }
  };

  this.destroy = () => {
    this.close(true);
  };
}

const modal1 = new Modal({
  templateId: "modal-1",
  destroyOnClose: false,
});

$("#open-modal-1").onclick = () => {
  const modalElement = modal1.open();

  // const img = modalElement.querySelector("img");
  // console.log(img);
};

const modal2 = new Modal({
  templateId: "modal-2",
  cssClass: ["class1"],
  onOpen: () => {
    console.log("Modal Opned");
  },
  onClose: () => {
    console.log("Modal Closed");
  },
});

$("#open-modal-2").onclick = () => {
  const modalElement = modal2.open();
  const form = modalElement.querySelector("#login-form");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = {
        email: $("#email").value.trim(),
        password: $("#password").value.trim(),
      };
      console.log(formData);
    };
  }
};
