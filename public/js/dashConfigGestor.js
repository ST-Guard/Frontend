function mascaraTel(i) {
    let v = i.value.replace(/\D/g, "");

    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 0) {
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    }

    if (v.length > 10) {
        v = v.replace(/(\d{5})(\d)/, "$1-$2");
    } else {
        v = v.replace(/(\d{4})(\d)/, "$1-$2");
    }

    i.value = v;
}
