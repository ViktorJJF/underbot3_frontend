<template>
  <!-- Sidemenu Area -->
  <div class="ecaps-sidemenu-area">
    <!-- Desktop Logo -->
    <div class="ecaps-logo">
      <a href="/"
        ><img
          class="desktop-logo"
          src="img/core-img/logo.png"
          alt="Desktop Logo" />
        <img
          class="small-logo"
          src="img/core-img/small-logo.png"
          alt="Mobile Logo"
      /></a>
    </div>

    <!-- Side Nav -->
    <div class="ecaps-sidenav" id="ecapsSideNav">
      <!-- Side Menu Area -->
      <div class="side-menu-area">
        <!-- Sidebar Menu -->
        <nav>
          <ul class="sidebar-menu" data-widget="tree">
            <li>
              <a href="analytic-dashboard.html"
                ><i class="bx bx-home-heart"></i
                ><span>Default Dashboard</span></a
              >
            </li>
            <li>
              <a href="crm-dashboard.html"
                ><i class="bx bx-chalkboard"></i><span>CRM Dashboard</span></a
              >
            </li>
            <li>
              <a href="eco-dashboard.html"
                ><i class="bx bxs-cart"></i><span>Ecommerce Dashboard</span></a
              >
            </li>
            <li>
              <a href="cry-dashboard.html"
                ><i class="bx bx-money"></i><span>Invest Dashboard</span></a
              >
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-home-heart"></i> <span>User Manage</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="analytic-customer.html">Customers</a></li>
                <li><a href="analytic-report.html">Reports</a></li>
                <li><a href="crm-add-clint.html">Add Client</a></li>
                <li><a href="crm-clint-list.html">Client List</a></li>
                <li><a href="crm-contact.html">Contacts</a></li>
                <li><a href="crm-profile-customer.html">Profile</a></li>
                <li><a href="crm-project.html">Project</a></li>
                <li><a href="project-details.html">Project Details</a></li>
                <li><a href="crm-task.html">Task</a></li>
                <li><a href="crm-leads.html">Leads</a></li>
              </ul>
            </li>
            <li class="treeview active">
              <a href="javascript:void(0)"
                ><i class="bx bx-tone"></i> <span>UI Kit</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="alert.html">Alert</a></li>
                <li><a href="avatar.html">Avatar</a></li>
                <li><a href="buttons.html">Button</a></li>
                <li class="active"><a href="card.html">Card</a></li>
                <li><a href="notification.html">Notification</a></li>
                <li><a href="general.html">General</a></li>
                <li><a href="progressbar.html">Progressbar</a></li>
                <li><a href="preloader.html">Preloader</a></li>
                <li><a href="tab.html">Tab</a></li>
                <li><a href="dropdown.html">Dropdown</a></li>
                <li><a href="typography.html">Typography</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-file"></i><span>Advanced</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="blank.html">Blank Page</a></li>
                <li><a href="gallery.html">Gallery</a></li>
                <li>
                  <a href="light-box-gallery.html">Light Box Gallery</a>
                </li>
                <li><a href="modals.html">Modals</a></li>
                <li><a href="profile.html">Profile</a></li>
                <li><a href="ribbons.html">Ribbons</a></li>
                <li><a href="sweet-alert.html">Sweet Alert</a></li>
              </ul>
            </li>

            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bxs-cart"></i> <span>Ecommerce</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="product.html">Product</a></li>
                <li><a href="e-add-product.html">Add Product</a></li>
                <li><a href="product-details.html">Single Product</a></li>
                <li><a href="order.html">Order</a></li>
                <li><a href="cart.html">Cart</a></li>
                <li><a href="checkout.html">Checkout</a></li>
                <li><a href="invoice.html">Invoice</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-money"></i> <span>Crypto</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="cryp-exchange.html">Exchange</a></li>
                <li><a href="crypto-wallet.html">Wallet</a></li>
                <li><a href="crypto-news.html">News</a></li>
                <li><a href="crypto-setting.html">Setting</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-printer"></i> <span>Job News</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="job.html">Job News</a></li>
                <li><a href="job-description.html">Description</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bxl-apple"></i> <span>Apps</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="calendar.html">Calendar</a></li>
                <li><a href="widgets.html">Widgets</a></li>
                <li><a href="chat-box.html">Chat box</a></li>
                <li><a href="timeline.html">Timeline</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-envelope"></i> <span>Email</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="mail-inbox.html">Inbox</a></li>
                <li><a href="mail-view.html">Mail View</a></li>
                <li><a href="compose-mail.html">Compose Mail</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-user-circle"></i><span>Custom Pages</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="slider.html">Slider</a></li>
                <li><a href="range-slider.html">Range Slider</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html">Register</a></li>
                <li><a href="forget-password.html">Forget Password</a></li>
                <li><a href="lock-screen.html">Lock Screen</a></li>
                <li><a href="404.html">404</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-bar-chart-square"></i><span>Charts</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="chartist.html">Chartist Chart</a></li>
                <li><a href="chart-js.html">Chart Js</a></li>
                <li><a href="morris-chart.html">Morris Chart</a></li>
                <li><a href="apex-chart.html">Apex Chart</a></li>
                <li><a href="c3-charts.html">C3 Chart</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bxs-eraser"></i><span>Forms</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="basic-form.html">Basic Form</a></li>
                <li><a href="advanced-elements.html">Elements</a></li>
                <li><a href="form-validation.html">Validation</a></li>
                <li><a href="form-wizard.html">Form Wizard</a></li>
                <li><a href="form-input-mask.html">Input Mask</a></li>
                <li><a href="file-upload.html">File upload</a></li>
                <li><a href="rating.html">Rating</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-list-ul"></i><span>Tables</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="basic-table.html">Basic Table</a></li>
                <li><a href="filter-table.html">Filter Table</a></li>
                <li><a href="data-table.html">Data Table</a></li>
                <li><a href="price-table.html">Price Table</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-aperture"></i><span>Icons</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="font-awesome.html">Font-Awsome Icons</a></li>
                <li><a href="pe-7-stroke.html">Pe-7 Stroke Icons</a></li>
                <li><a href="matarial-icons.html">Materialize Icons</a></li>
                <li><a href="themify-icons.html">Themify Icons</a></li>
                <li><a href="elegant-icons.html">Elegant Icons</a></li>
                <li><a href="et-line-icons.html">Et-line Icons</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-map"></i><span>Maps</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="vector-map.html">Vector Map</a></li>
                <li><a href="google-map.html">Google Map</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="javascript:void(0)"
                ><i class="bx bx-share-alt"></i> <span>Multilevel</span>
                <i class="fa fa-angle-right"></i
              ></a>
              <ul class="treeview-menu">
                <li><a href="#">Level One</a></li>
                <li class="treeview">
                  <a href="#">Level One <i class="fa fa-angle-right"></i></a>
                  <ul class="treeview-menu">
                    <li><a href="#">Level Two</a></li>
                    <li><a href="#">Level Two</a></li>
                    <li><a href="#">Level Two</a></li>
                  </ul>
                </li>
                <li><a href="#">Level One</a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
