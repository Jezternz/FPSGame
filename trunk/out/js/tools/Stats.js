"use strict";
{
    window.Stats = {

        update: function(key, str)
        {

            var statsContainer = document.querySelector("#stats");
            var match = Array.prototype.filter.call(statsContainer.childNodes, function(node){ return node.getAttribute("data-stat-key") === key; }).pop();
            if(!match)
            {
                match = document.createElement("div");
                match.setAttribute("data-stat-key", key);
                match.classList.add("stat-block");
                statsContainer.insertBefore(match, statsContainer.firstChild);
            }
            match.innerHTML = str;
        }

    };
}