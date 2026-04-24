<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";

  export let src;
  // export let width;
  // export let height;

  const dispatch = createEventDispatcher();

  const MIN_CROP_SIZE = 100;
  const DEFAULT_CROP_BOX = {
    top: 23,
    left: 40,
    width: 150,
    height: 150,
    x: 0,
    y: 0,
    isMove: false
  };

  let imgSrc = "";
  let imgData = "";
  let minSize = MIN_CROP_SIZE;
  let elWrap;

  // // 整体容器
  //   let container = {
  //       width: width || 0,
  //       height: height || 0
  //   };
  // 裁剪容器
  let wrapBox = {
    top: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0
  };
  // 原图片
  let originImg = null;

  // 图片属性
  let scale = {
    width: 0,
    height: 0,
    ratio: 1
  };

  // 预览块
  let cropBox = Object.assign({}, DEFAULT_CROP_BOX);

  // 缩放块
  let zoomBox = {
    x: 0,
    y: 0,
    isMove: false
  };

  // 阴影遮罩块
  let coverBoxs = [
    { left: "0", width: "0", height: "0" }, // top
    { left: "0", width: "0" }, // right
    { top: "0", left: "0", width: "0", height: "0" }, // bottom
    { width: "0" } // left
  ];

  $: wrapStyle = `
      width: ${wrapBox.width}px;
      height: ${wrapBox.height}px;
      margin-top: ${wrapBox.top}px;`;

  $: cropBoxStyle = `
      top: ${cropBox.top}px;
      left: ${cropBox.left}px;
      width: ${cropBox.width}px;
      height: ${cropBox.height}px;
    `;

  $: start(src);

    // function updateContainerSize() {
    //     if (!elWrap) return

    //     const rect = elWrap.parentElement.getBoundingClientRect()

    //     container.width = rect.width
    //     container.height = rect.height
    // }

  // 设置裁剪容器大小位置
  function setWrapBox() {
    if (!scale.width || !scale.height) return null;
    const rect = elWrap.parentElement.getBoundingClientRect()

    const containerWidth = rect.width
    const containerHeight = rect.height
    let width,
      height,
      top = 0;
    if (scale.width > scale.height) {
      width = containerWidth;
      height = Math.floor((containerWidth * scale.height) / scale.width);
      top = (containerHeight - height) / 2;
    } else {
      width = Math.floor((containerHeight * scale.width) / scale.height);
      height = containerHeight;
    }

    wrapBox = Object.assign(wrapBox, {
      width,
      height,
      top: top
    });

    scale.ratio = scale.width / width;
  }

  // 设置裁剪容器位置
  function setWrapPosition() {
    let x, y;
    const el = elWrap;
    if (el) {
      const rect = el.getBoundingClientRect();
      x = rect.x || rect.left;
      y = rect.y || rect.top;
      wrapBox = Object.assign(wrapBox, {
        x,
        y
      });
    }
  }

  // 设置默认裁剪框
  function setDefaultCrop() {
    cropBox.width = Math.min(200, wrapBox.width);
    cropBox.height = Math.min(150, wrapBox.height);
    cropBox.top = 0;
    cropBox.left = 0;
  }

  // 设置阴影遮挡块
  function setCoverBox() {
    function nonnegative(val) {
      return val < 0 ? 0 : val;
    }
    const top = coverBoxs[0],
      right = coverBoxs[1],
      bottom = coverBoxs[2],
      left = coverBoxs[3];

    top.left = bottom.left = left.width = cropBox.left + "px";
    top.width = bottom.width = cropBox.width + "px";
    top.height = cropBox.top + "px";
    right.left = cropBox.left + cropBox.width + "px";
    right.width =
      nonnegative(wrapBox.width - cropBox.left - cropBox.width) + "px";
    bottom.top = cropBox.top + cropBox.height + "px";
    bottom.height =
      nonnegative(wrapBox.height - cropBox.top - cropBox.height) + "px";

    coverBoxs[0] = top; // fix: 更新视图赋值
  }

  // 生成裁剪后图片
  function createImg() {
    const canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d");
    canvas.width = cropBox.width;
    canvas.height = cropBox.height;
    ctx.drawImage(
      originImg,
      -cropBox.left,
      -cropBox.top,
      wrapBox.width,
      wrapBox.height
    );
    imgData = canvas.toDataURL();
  }

    function crop() {
        createImg();
        dispatch("crop", {
            dataUrl: imgData
        });
    }

  // 裁剪框开始移动
  function cropMoveStart(e) {
    e.preventDefault();
    cropBox.x = e.screenX;
    cropBox.y = e.screenY;
    cropBox.isMove = true;
  }

  // 裁剪框移动结束
  function cropMoveEnd(e) {
    e.preventDefault();
    cropBox.isMove = false;
  }

  // 裁剪框移动
  function cropMove(e) {
    e.preventDefault();
    const { x, y, left, top, width, height, isMove } = cropBox;
    if (!isMove) return;
    const ex = e.screenX,
      ey = e.screenY,
      rLeft = left - (x - ex),
      rTop = top - (y - ey);
    cropBox.left =
      rLeft >= 0 && rLeft <= wrapBox.width - width ? rLeft : cropBox.left;
    cropBox.top =
      rTop >= 0 && rTop <= wrapBox.height - height ? rTop : cropBox.top;
    cropBox.x = ex;
    cropBox.y = ey;
    setCoverBox();
    crop();
  }

  // 缩放框开始移动
  function zoomMoveStart(e) {
    e.preventDefault();
    zoomBox.isMove = true;
  }

  // 缩放框移动结束
  function zoomMoveEnd(e) {
    e.preventDefault();
    zoomBox.isMove = false;
  }

  // 缩放框移动
  function zoomMove(e) {
    e.preventDefault();
    const { isMove } = zoomBox,
      { left, top } = cropBox;
    if (!isMove) return;
    const ex = e.clientX,
      ey = e.clientY,
      rWidth = ex - wrapBox.x - left,
      rHeight = ey - wrapBox.y - top,
      newWidth = rWidth,
      newHeight = rHeight;
    if (
      newWidth >= minSize &&
      newHeight >= minSize &&
      newWidth <= (wrapBox.width - left) &&
      newHeight <= (wrapBox.height - top)
    ) {
      cropBox.width = newWidth;
      cropBox.height = newHeight;

      setCoverBox();
      crop();
    }
  }

  function obj2style(obj) {
    const arr = [];
    Object.keys(obj).forEach(key => {
      arr.push(`${key}:${obj[key]}`);
    });
    return arr.join(";");
  }

  function start(src) {
    if (imgSrc === src) return;
    imgSrc = src;

    const img = new Image();
    img.src = imgSrc;
    if (!imgSrc.startsWith('file://')) {
      img.setAttribute("crossOrigin", "Anonymous");
    }
    img.onload = () => {
      originImg = img;
      scale.width = img.width;
      scale.height = img.height;

      setWrapBox();
      setWrapPosition();
      setDefaultCrop();
      setCoverBox();
      crop();
    };
  }

    onMount(() => {
        // updateContainerSize()

        // window.addEventListener('resize', updateContainerSize)
        document.addEventListener("mouseup", zoomMoveEnd);
        document.addEventListener("mousemove", zoomMove);
    });

    onDestroy(() => {
        // window.removeEventListener('resize', updateContainerSize)
        document.removeEventListener("mouseup", zoomMoveEnd);
        document.removeEventListener("mousemove", zoomMove);
    });
</script>

<div>
  <div
    class="crop-img">
    <div class="crop-wrap" style={wrapStyle} bind:this={elWrap}>
      {#if imgSrc}
        <img src={imgSrc} alt="img-crop" />
      {/if}

      <!-- 裁剪显示容器 -->
      <div class="crop-box" style={cropBoxStyle}>
        <div
          class="crop-box__move"
          on:mouseup={cropMoveEnd}
          on:mousedown={cropMoveStart}
          on:mousemove={cropMove}
          on:mouseout={cropMoveEnd} />
        <div class="zoom-box" on:mousedown={zoomMoveStart} />
      </div>
      <!-- 阴影遮挡块 -->
      <div class="cover-wrap">
        {#each coverBoxs as style}
          <div class="cover-box" style={obj2style(style)} />
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
    .crop-img {
      width: 100%;
      height: 100%;
      min-height: 300px;
      overflow: hidden;
      background: #f5f5f5;
    }

  .crop {
    &-wrap {
      position: relative;
      margin: auto;
      box-sizing: border-box;
      background: #ccc;
      img {
        width: 100%;
        height: 100%;
      }
    }

    &-box {
      position: absolute;
      z-index: 2;

      &__move {
        width: 100%;
        height: 100%;
        border: 2px solid rgba(255, 255, 255, 0.6);
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0); // fix: ie10 无背景bug
        cursor: move;
      }

      .zoom-box {
        position: absolute;
        right: -3px;
        bottom: -3px;
        width: 5px;
        height: 5px;
        background: #ffffff;
        cursor: se-resize;
      }
    }
  }

  .cover {
    &-wrap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      z-index: 1;
    }

    &-box {
      position: absolute;
      top: 0;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
</style>