(() => {
  function loadJQuery(callback) {
    if (window.jQuery) {
      callback(window.jQuery);
    } else {
      const script = document.createElement("script");
      script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
      script.onload = () => callback(window.jQuery);
      document.head.appendChild(script);
    }
  }

  loadJQuery(($) => {
    const PRODUCT_URL =
      "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const STORAGE_KEY = "carouselProducts";
    const FAVORITES_KEY = "favoriteProducts";

    const self = {};
    let products = [];
    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    let position = 0;

    self.init = async () => {
      if (!$(".product-detail").length) return;
      await self.loadProducts();
      self.buildHTML();
      self.buildCSS();
      self.setEvents();
      self.renderProducts();
    };

    self.loadProducts = async () => {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        products = JSON.parse(cached);
      } else {
        const res = await fetch(PRODUCT_URL);
        products = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      }
    };

    self.buildHTML = () => {
      const html = `
        <div class="carousel">
          <div class="carousel-inner">
            <h2>Bunları da beğenebilirsiniz</h2>
            <div class="carousel-outer-wrapper">
              <button class="carousel-btn prev">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 14.242 24.242">
                  <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"/>
                </svg>
              </button>

              <div class="carousel-wrapper">
                <div class="carousel-track"></div>
              </div>

              <button class="carousel-btn next">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 14.242 24.242">
                  <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M1.4 1.4l10 10-10 10"/>
                </svg>
              </button>
            </div>
          </div>
        </div>`;
      $(".product-detail").after(html);
    };

    self.buildCSS = () => {
      const css = `
        *{
          font-family: 'Open Sans', sans-serif;      
        }
        .carousel {
          margin: 20px 0;
          background-color: #f4f5f7;
          padding: 30px 0;
          width: 100%;
          box-sizing: border-box;
        }
        
        .carousel-inner {
          max-width: 90%;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .carousel-inner h2 {
          font-size: 32px;
          line-height: 43px;
          margin-bottom: 2em !important;
          margin-left: 2em;
          text-align: left;
          font-weight: lighter;
          color: #29323b;
        }

        .carousel-outer-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5em;
          width: 100%;
        }

        .carousel-wrapper {
          overflow: hidden;
          flex-grow: 1;
        }

        .carousel-track {
          display: flex;
          gap: 1em;
          transition: transform 0.3s ease-in-out;
        }

        .carousel-item {
          flex: 0 0 calc((100% - 4em) / 5);
          background: #fff;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .image-wrapper {
          width: 100%;
          position: relative;
        }

        .carousel-item img {
          width: 100%;
          height: auto;
          display: block;
          cursor: pointer;
        }

        .heart {
          position: absolute;
          top: 6%;
          right: 10%;
        }

        .card-info {
          padding: 0 10px;
          text-align: left;
          background: white;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-info p {
          margin: 4px 0;
          font-size: 14px;
        }

        .priceSection {
          font-weight: bold;
          font-size: 18px;
          color: #193db0;
          margin-top: auto;
        }

        .carousel-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .carousel-btn svg {
          width: 28px;
          height: 28px;
        }

        @media (max-width: 1024px) {
          .carousel-item {
            flex: 0 0 calc((100% - 3em) / 4);
          }
        }

        @media (max-width: 768px) {
          .carousel-item {
            flex: 0 0 calc((100% - 2em) / 3);
          }
        }

        @media (max-width: 500px) {
          .carousel-item {
            flex: 0 0 calc((100% - 1em) / 2);
          }
        }
      `;
      $("<style>").html(css).appendTo("head");
    };

    const emptyHeart =
      `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none"><path fill="#fff" fill-rule="evenodd" stroke="#B6B7B9" d="M19.97 6.449c-.277-3.041-2.429-5.247-5.123-5.247-1.794 0-3.437.965-4.362 2.513C9.57 2.147 7.993 1.2 6.228 1.2c-2.694 0-4.846 2.206-5.122 5.247-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z" clip-rule="evenodd"></path></svg>`;

    const filledHeart =
      `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" fill="none"><path fill="#193DB0" fill-rule="evenodd" d="M18.97 5.449C18.693 2.408 16.54.202 13.847.202c-1.794 0-3.437.965-4.362 2.513C8.57 1.147 6.993.2 5.228.2 2.534.201.382 2.407.106 5.448c-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z" clip-rule="evenodd"></path></svg>`;

    self.renderProducts = () => {
      const $track = $(".carousel-track");
      $track.empty();

      products.forEach((product) => {
        const isFav = favorites.includes(product.id);
        const heartIcon = isFav ? filledHeart : emptyHeart;

        const $item = $(`
          <div class="carousel-item" data-id="${product.id}">
            <div class="image-wrapper">
              <img src="${product.img}" alt="${product.name}" />
              <span class="heart">${heartIcon}</span>
            </div>
            <div class="card-info">
              <p>${product.name}</p>
              <div class="priceSection">${product.price} TL</div>
            </div>
          </div>
        `);
        $track.append($item);
      });
    };

    const getStep = () => {
      const visibleWidth = $(".carousel-wrapper").width();
      const gap = parseFloat($(".carousel-track").css("gap")) || 0;
      return (visibleWidth - gap * 4) / 5 + gap;
    };

    self.setEvents = () => {
      $(document).on("click", ".carousel-btn.next", () => {
        const step = getStep();
        const maxScroll =
          $(".carousel-track")[0].scrollWidth - $(".carousel-wrapper").width();
        position = Math.min(position + step, maxScroll);
        $(".carousel-track").css("transform", `translateX(-${position}px)`);
      });

      $(document).on("click", ".carousel-btn.prev", () => {
        const step = getStep();
        position = Math.max(position - step, 0);
        $(".carousel-track").css("transform", `translateX(-${position}px)`);
      });

      $(document).on("click", ".carousel-item img", function () {
        const id = $(this).closest(".carousel-item").data("id");
        const product = products.find((p) => p.id === id);
        if (product?.url) window.open(product.url, "_blank");
      });

      $(document).on("click", ".heart", function () {
        const id = $(this).closest(".carousel-item").data("id");
        const isFav = favorites.includes(id);

        if (isFav) {
          favorites = favorites.filter((f) => f !== id);
          $(this).html(emptyHeart);
        } else {
          favorites.push(id);
          $(this).html(filledHeart);
        }

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      });
    };

    self.init();
  });
})();
