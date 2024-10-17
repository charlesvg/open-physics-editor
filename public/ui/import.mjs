export function registerImportFile(callback, thiz) {
    $('#importFile').on('change', function (e) {
        const URL = window.webkitURL || window.URL;
        try {
            const url = URL.createObjectURL(e.target.files[0]);
            callback(url);
        } catch (e) {
        }
    })
}