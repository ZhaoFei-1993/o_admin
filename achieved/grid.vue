<template>
    <div>
        <div class="container">
            <p>总宽度1152px，分24列，每列48px，需要减掉分割线16px;</p>
            <p>实际内容宽度为1136px，因为减去左右共16px边距</p>
            <div class="row">
                <div class="col-1">
                    <div class="size-test">48 - 16 = 32px</div>
                </div>
                <div class="col-2">
                    <div class="size-test">96 - 16 = 80px</div>
                </div>
                <div class="col-3">
                    <div class="size-test">3*48 - 16 = 128px</div>
                </div>
                <div class="col-4">
                    <div class="size-test">4*48 - 16 = 176px</div>
                </div>
                <div class="col-5">
                    <div class="size-test">5*48 - 16 = 224px</div>
                </div>
                <div class="col-6">
                    <div class="size-test">6*48 - 16 = 272px</div>
                </div>
                <div class="col-7">
                    <div class="size-test">7*48 - 16 = 320px</div>
                </div>
                <div class="col-8">
                    <div class="size-test">8*48 - 16 = 368px</div>
                </div>
                <div class="col-9">
                    <div class="size-test">9*48 - 16 = 416px</div>
                </div>
                <div class="col-10">
                    <div class="size-test">10*48 - 16 = 464px</div>
                </div>
                <div class="col-14">
                    <div class="size-test">14*48 - 16 = 646px</div>
                </div>
                <div class="col-12">
                    <div class="size-test">12*48 - 16 = 560px</div>
                </div>
                <div class="col-12">
                    <div class="size-test">12*48 - 16 = 560px</div>
                </div>
                <div class="col-5">
                    <div class="size-test">5*48 - 16 = 224px</div>
                </div>
                <div class="col-19">
                    <div class="size-test">19*48 - 16 = 896px</div>
                </div>
                <div class="col-6">
                    <div class="size-test">6*48 - 16 = 272px</div>
                </div>
                <div class="col-18">
                    <div class="size-test">18*48 - 16 = 848px</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  export default {
    layout: 'default',
  }
</script>
<style lang="scss" scoped>
    .container{
        background-color: #eee;
    }
    .size-test {
        background-color: #7f828b;
        color: white;
        height: 100px;
        padding: 2px;
        margin-bottom: 16px;
    }
</style>