'use strict';

//--- ajax (теория) ---//
/*
const
    xhr = new XMLHttpRequest(); // позволяет управлять запросами

// .open() дает возможность настроить будущий запрос, принимает несколько параметров
// подробно о методе: https://developer.mozilla.org/ru/docs/Web/API/XMLHttpRequest/open
xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts');

// .send() - принимает инфо, передаваемую на сервер. В случае с get передавать ничего не надо.
// https://developer.mozilla.org/ru/docs/Web/API/XMLHttpRequest/send
xhr.send();

// для получения данных нужно привязаться к событиям на сервере

// xhr.readyState имеет 5 состояний:
// 0 - изначальное состояние
// 1 - когда вызвали метод open() с настройками
// 2 - получены заголовки (headers)
// 3 - когда загружается тело, пакет данных
// 4 - запрос завершен успешно. Можно работать с полученными данными.

// полученный ответ всегда хранится в xhr.responseText
// if (xhr.readyState === 4) {
//     console.log(xhr.responseText);
// }

// более короткий и новый способ - через load
xhr.addEventListener('load', function (e) {
    console.log(xhr.responseText);
    // xhr.status - статус код 200, 404
    // xhr.statusText - хранит в себе текст ответа: 200 - 'ok', 404 - 'not found'
});

// для обработки ошибок есть событиие 'error'
// работает только, если сервер вместе с 404 присылает сообщение об ошибке
xhr.addEventListener('error', function (e) {
    console.log(xhr.responseText)
});

// время, которое готовы ждать ответ от сервера, если время ответа истекло,
// то можно реализовать событие
xhr.timeout = 1000;
xhr.addEventListener('timeout', function (e) {
    console.log(xhr.timeout);
});


// установка заголовков
// 1й- имя заголовка
// 2й - значение заголовка
xhr.setRequestHeader('Content-type', 'application/json');

// xhr.getResponseHeader('Content-type') - метод на получение конкретного заголовка
// xhr.getAllResponseHeaders() - метод на получение всех заголовков, которые есть в ответе
/**/



//--- ajax (практика) ---//
/**/

// settings = {
//    method: "GET",
//    url: "https://..."
//    data: "данные, которые хочу отправить на сервер"
//    timeout: 3000
//    success: принимает функцию, которая должна отработать в случае успешного взаимодействия с сервером
//    error: функция обработки ошибки
// }

const
    ajax = (function () {
        
        function send(settings) {

            const xhr = new XMLHttpRequest();

            xhr.addEventListener('error', function (e) {
                settings.error({
                    errorText: xhr.responseText,
                    code: xhr.status
                });
            });

            xhr.addEventListener('load', function (e) {
                settings.success(xhr.responseText);
            });

            if (settings.headers) {
                for (let headerName in settings.headers) {
                    console.log(headerName);
                    xhr.setRequestHeader(headerName, settings.headers[headerName]);
                }
            }

            xhr.addEventListener('timeout', function (e) {
                // какие-то действия по таймауту
            });

            xhr.open(settings.method, settings.url);
            xhr.timeout = settings.timeout || 10000;
            xhr.send(settings.data);

        }

        return {
            send: send
        }

})();

// получаем все посты (get all posts)
ajax.send({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts',
    success: function (res) {
        let response = JSON.parse(res);
        console.log(response);
    },
    error: function (err) {
        console.log(err);
    },
});

// добавляем пост
ajax.send({
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    data: JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    },
    success: function (res) {
        let response = JSON.parse(res);
        console.log(response);
    },
    error: function (err) {
        console.log(err);
    },
});
/**/