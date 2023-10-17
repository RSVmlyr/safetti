const qnaddproduct = () => {
    const qnaddproducts = document.querySelectorAll(".qnaddproducts.add");
    qnaddproducts.forEach((item) => {
        const exist = localStorage.getItem('ClientFullName');
        if (exist === null) {
            item.classList.add('d-none');
        } else {
            item.classList.remove('d-none');
        }
    });
}

export default qnaddproduct
